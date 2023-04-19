import { CopyOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  List,
  PageHeader,
  Row,
  Space,
  Statistic,
  message,
} from 'antd';
import BoringAvatar from 'boring-avatars';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Layouts from '../../components/layouts';
import { getRandomColors } from '../../utils/color';

const colors = getRandomColors();

const PAGE_TITLE = '靓号生成';

export default function ToolAddress({ name }) {
  const [form] = Form.useForm();

  const router = useRouter();
  const WORKER_COUNT = 12;
  const [result, setResult] = React.useState([]);
  const resultRef = React.useRef(result);
  const [count, setCount] = React.useState(0);
  const countRef = React.useRef(count);
  const [status, setStatus] = useState(false);
  const statusRef = React.useRef(status);

  const workersRef = React.useRef([]);
  const suffixRef = React.useRef([]);
  const suffixResultRef = React.useRef([]);
  const timerRef = React.useRef(null);
  const [cost, setCost] = React.useState(0);

  React.useEffect(() => {
    const { suffix } = router.query;
    if (suffix) {
      form.setFieldValue('suffix', suffix);
    }
    return () => {
      if (statusRef.current === true) {
        handleStop();
      }
    };
  }, [router]);

  const notifyWorker = (cmd) => {
    if (workersRef.current.length) {
      workersRef.current.forEach((worker) => {
        worker.postMessage(cmd);
      });
    }
  };

  const stopWorker = () => {
    if (workersRef.current.length) {
      workersRef.current.forEach((worker) => {
        worker.terminate();
        worker = null;
      });
      workersRef.current = [];
    }
  };

  const initTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    const start = new Date().getTime();
    timerRef.current = setInterval(() => {
      const costSeconds = Math.floor((new Date().getTime() - start) / 1000);
      setCost(costSeconds);
    }, 1000);
  };

  const handleItem = (account, suffixItem) => {
    if (suffixRef.current.includes(suffixItem)) {
      resultRef.current = [...resultRef.current, account];
      setResult(resultRef.current);

      if (suffixRef.current.length === suffixResultRef.current.length) {
        handleStop();
        suffixRef.current = [];
        suffixResultRef.current = [];
      } else {
        suffixResultRef.current = [
          ...new Set([...suffixResultRef.current, suffixItem]),
        ];
      }
    }
  };

  const initWorker = (threadCount) => {
    if (workersRef.current.length === 0) {
      const workerList = [];
      for (let i = 0; i < threadCount; i++) {
        const worker = new Worker('/js/worker.js');
        worker.onmessage = (event) => {
          const [cmd, data] = event.data;
          if (cmd === 'ITEM') {
            const { account, suffix } = data;
            handleItem(account, suffix);
          }
          if (cmd === 'COUNT') {
            countRef.current = countRef.current + data;
            setCount(countRef.current);
          }
        };
        worker.onerror = (err) => {
          console.error(err);
        };
        workerList.push(worker);
      }
      workersRef.current = workerList;
    }
  };

  const handleStart = () => {
    if (statusRef.current === true) {
      return;
    }

    const suffix = form.getFieldValue('suffix');
    if (!suffix) {
      suffixRef.current = [];
      message.warning('地址后缀不能为空');
      return;
    }

    if (suffix.includes('，')) {
      suffixRef.current = [];
      message.warning('不能包含中文逗号');
      return;
    }

    if (suffix.includes(' ')) {
      suffixRef.current = [];
      message.warning('不能包含空格');
      return;
    }

    let suffixList = suffix.split(',').filter((i) => i !== '');
    suffixRef.current = [...new Set(suffixList)];

    const suffixLen = suffixRef.current[0].length;

    const thread = form.getFieldValue('thread');

    initWorker(thread);
    notifyWorker([
      'START',
      {
        suffixList,
        suffixLen,
      },
    ]);
    initTimer();

    countRef.current = 0;
    resultRef.current = [];
    statusRef.current = true;
    setStatus(statusRef.current);
  };

  const handleStop = () => {
    if (statusRef.current === false) {
      return;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    notifyWorker(['STOP']);
    stopWorker();
    statusRef.current = false;
    setStatus(statusRef.current);
  };

  return (
    <>
      <PageHeader
        title={PAGE_TITLE}
        subTitle="批量生成指定后缀的靓号地址"
        ghost={false}
      ></PageHeader>
      <div className="wrapper">
        <Form
          form={form}
          layout="inline"
          initialValues={{
            suffix: '',
            thread: WORKER_COUNT,
          }}
        >
          <Form.Item style={{ flex: 1 }} name="suffix">
            <Input
              placeholder="请输入待生成地址的后缀，多个后续用英文逗号分隔。如: 1111,2222,3333"
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item style={{ width: '140px' }} name="thread">
            <InputNumber addonBefore="线程数" min={1} max={12} />
          </Form.Item>
          <Form.Item style={{ marginRight: '0px' }}>
            <Button
              type="primary"
              disabled={statusRef.current === true}
              onClick={handleStart}
            >
              开始
            </Button>
            <Divider type="vertical"></Divider>
            <Button onClick={handleStop} disabled={statusRef.current === false}>
              停止
            </Button>
          </Form.Item>
        </Form>

        <Divider />
        <Row gutter={15}>
          <Col span={8}>
            <Statistic title="检测地址数" value={countRef.current} />
          </Col>
          <Col span={8}>
            <Statistic title="已生成地址数" value={resultRef.current.length} />
          </Col>
          <Col span={8}>
            <Statistic title="累计耗时(秒)" value={cost} />
          </Col>
        </Row>
        <Divider />
        <List
          itemLayout="horizontal"
          dataSource={resultRef.current}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <BoringAvatar
                    circle
                    size={46}
                    name={item.address.base58}
                    variant="bauhaus"
                    colors={colors}
                  ></BoringAvatar>
                }
                title={
                  <Space>
                    <span>{item.address.base58}</span>
                    <CopyToClipboard
                      text={item.address.base58}
                      onCopy={() => message.success('address copied.')}
                    >
                      <Button
                        size="small"
                        type="link"
                        icon={<CopyOutlined />}
                      ></Button>
                    </CopyToClipboard>
                  </Space>
                }
                description={
                  <Space>
                    <span>{item.privateKey}</span>
                    <CopyToClipboard
                      text={item.privateKey}
                      onCopy={() => message.success('private key copied.')}
                    >
                      <Button
                        size="small"
                        type="link"
                        icon={<CopyOutlined />}
                      ></Button>
                    </CopyToClipboard>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </div>
    </>
  );
}

ToolAddress.getPageTitle = function () {
  return PAGE_TITLE;
};

ToolAddress.getLayout = function getLayout(page) {
  return <Layouts>{page}</Layouts>;
};
