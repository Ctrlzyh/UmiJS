import React, { useRef, useState, useEffect} from 'react';
import Guide from '@/components/Guide';
import { trim } from '@/utils/format';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import styles from './index.less';
import { Radio, Tabs, } from 'antd';
import type { SelectProps, RadioChangeEvent, TabsProps } from 'antd';
import request from '@/utils/request';


const HomePage: React.FC = () => {
  const { name } = useModel('global');
  const [videoNumber, setVideoNumber] = useState<String>("1");

  useEffect(() => {
   let res = request('/user/info',null,'post');
   res.then(response => {
    // console.log('111111111网络请求成功：', response);
  })
  }, []);

  const handleSizeChange = (e: RadioChangeEvent) => {
    setVideoNumber(e.target.value)
  };

  const onChange = (key: string) => {
    console.log(key);
  };

  const toOther = () =>{
      console.log('11111')
      window.open(`http://moni3.haimijiaoyu.com?id=${name}`)
  }

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `仿真资源`,
      children: <img style={{ width: "100%"}} src={require('../../assets/pane1.png')} onClick={toOther}/>,
    },
    {
      key: '2',
      label: `团队成员`,
      children: <img style={{ width: "100%"}} src={require('../../assets/pane2.png')} />,
    },
    {
      key: '3',
      label: `申报材料`,
      children: <img style={{ width: "100%"}} src={require('../../assets/pane3.png')} />,
    },
    {
      key: '4',
      label: `操作手册`,
      children: <img style={{ width: "100%"}}  src={require('../../assets/pane4.png')} />,
    },
    {
      key: '5',
      label: `项目特色`,
      children: 
      <div>
        <div style={{fontSize: "16px", marginBottom: "8px"}}>1.课程管理添加后无法对其进行编辑，添加编辑或删除功能</div>
        <img style={{ width: "100%"}}  src={require('../../assets/pane501.png')} />,
        <div style={{fontSize: "16px", marginBottom: "8px"}}>2.资料上传添加一行观看链接。</div>
        <img style={{ width: "100%"}}  src={require('../../assets/pane502.png')} />,
        <div style={{fontSize: "16px", marginBottom: "8px"}}>3.素材管理只有删除没有编辑，添加编辑功能。</div>
        <img style={{ width: "100%"}}  src={require('../../assets/pane503.png')} />,
        <div style={{fontSize: "16px", marginBottom: "8px"}}>4.资源库图片没有正常显示。</div>
        <img style={{ width: "100%"}}  src={require('../../assets/pane504.png')} />,
      </div>,
    },
    {
      key: '6',
      label: `实验信息`,
      children: 
      <div>
        <div style={{fontSize: "17px",fontWeight:'500', textAlign:'center',marginBottom:'15px' }}>实验项目知识点</div>
        <div style={{fontWeight:'500'}}>（1）高压蒸汽灭菌：</div>
        <div>高压蒸汽灭菌是目前最常用的一种灭菌方法。利用高压蒸汽以及在蒸气环境中存在的潜热作用和良好的穿透力，使菌体蛋白质凝固变性，致使微生物死亡。主要用于能耐高温的物品，如培养基、金属器械、玻璃、搪瓷、敷料、橡胶及一些药物的灭菌。温度一般设置为121 °C，灭菌15~30分钟即可。 </div>
        <div style={{fontWeight:'500'}}>（2）培养基：</div>
        <div>是指供给微生物、植物或动物（或组织）生长繁殖的，由不同营养物质组合配制而成的营养基质。一般都含有碳水化合物、含氮物质、无机盐（包括微量元素）、维生素和水等几大类物质。培养基既是提供细胞营养和促使细胞增殖的基础物质，也是细胞生长和繁殖的生存环境。马铃薯葡萄糖琼脂培养基（简称PDA培养基），是一种用于分离和培养霉菌、蘑菇等真菌的常用培养基。</div>
        <div style={{fontWeight:'500'}}>（3）菌悬液：</div>
        <div>含有微生物细胞的悬浮液。菌悬液是2012年公布的微生物学名词。 </div>
        <div style={{fontWeight:'500'}}>（4）稀释涂布平板法：</div>
        <div>微生物学实验中的一种操作方法。取一定稀释度、一定量的稀释液接种到平板中，使其均匀分布于平板中的培养基内。一般用于某些成品检定（如杀虫菌剂等）、生物制品检验、土壤含菌量测定及食品、水源的污染程度的检验。由于将含菌材料现加到还较烫的培养基中再倒平板易造成某些热敏感菌的死亡，而且采用稀释倒平板法也会使一些严格好氧菌因被固定在琼脂中间缺乏氧气而影响其生长，因此在微生物学研究中更常用的纯种分离方法是稀释涂布平板法。 </div>
        <div style={{fontWeight:'500'}}>（5）牛津杯法：</div>
        <div>又称杯碟法、管碟法。牛津杯是内径为6 mm，外径为8 mm，高10 mm的圆筒形不锈钢小管。将培养基平板置培养箱中培养，一方面试验菌（指示菌）开始生长繁殖；另一方面抗生素呈球面扩散形成递减的梯度浓度，离杯越近，抗生素浓度越大，离杯越远抗生素浓度越小。在牛津杯周围抑菌浓度范围内的试验菌生长被抑制，形成透明的抑菌圈。抑菌圈大小反应测试菌对测定药物的敏感程度或药物对指示菌的抑制程度。抗生素浓度越高，抑菌圈越大。抑菌圈直径与药物对测试菌的最低抑菌浓度成负相关，即抑菌圈愈大，MIC愈小。</div>
        <div style={{fontWeight:'500'}}>（6）最低抑菌浓度（MIC）：</div>
        <div>为最小抑制病原微生物繁殖的药物浓度，，是测量抗菌药物的抗菌活性大小的一个指标。在抑菌圈的边缘处，琼脂培养基中所含抑菌物质的浓度即为该菌悬液中对该种指示菌的MIC。</div>
      </div>
    },
  ];

  return (
    <PageContainer
      header={{
        title: ''
      }}
      style={{
      }}
    >
      <div className={styles.container}>
        <div className={styles.headerBgView}>
          <div className={styles.headerView}>
            <div>
              <img src={require('../../assets/logo1.png')} className={styles.logoImg} />
              <span className={styles.headerTitle}>虛拟仿真实验教学申报项目</span>
            </div>
            <div>
              <img className={styles.headerNameLogo} src={require('../../assets/user.png')} />
              <span className={styles.headerName}>用户昵称</span>
            </div>
          </div>
        </div>


        <div className={styles.content}>
          <div className={styles.introductionView}>
            <div className={styles.introductionLeftView}>
              <div className={styles.rowText1}>牛津杯法检测植物粗提物对烟草病原真菌的抑制作用虛拟仿真实验</div>
              <span className={styles.rowText2} style={{ opacity: 0 }}>本实验基</span>
              <span className={styles.rowText2}>本实验基于河南农业大学烟草学院学科优势，以烟草品质生态团队研究成果为基础、模拟学习PDA培养基配制、高压蒸汽灭菌、倒平板、菌液涂布、摆放牛津杯、 添加外源物质等实验内容。</span>
            </div>
            <div className={styles.introductionRightView}>
              <Radio.Group defaultValue="1" buttonStyle="solid" size="large" style={{ width: '400px', position:'relative'}} onChange={handleSizeChange}>
                <Radio.Button value="1">申报视频</Radio.Button>
                <Radio.Button value="2">引导视频</Radio.Button>
                <div style={{position:'absolute', top: 0, left: 199, width: 2, height: 40, backgroundColor: 'rgb(234, 234, 234)', zIndex: 999 }}></div>
              </Radio.Group>
              <div className={styles.videoView}>
                {videoNumber === "1" && <video width="400" controls autoPlay={false}>
                  <source src={require('../../assets/mp402.mp4')} type="video/ogg" />
                </video>}
                {videoNumber === "2" && <video width="400" controls autoPlay={false}>
                  <source src={require('../../assets/mp401.mp4')} type="video/ogg" />
                </video>}

              </div>
            </div>
          </div>
          <div style={{ width: "64%", height: "1px", backgroundColor: "#000", margin: "0 auto", marginTop: "20px" }}></div>

        <div className={styles.infoView}>
          <Tabs defaultActiveKey="1" size="large" items={items} onChange={onChange} />
        </div>

        <div className={styles.bottomView}>
          <div>
            <img style={{width: '36px', marginRight:'10px'}} src={require('../../assets/bottom_logo.png')}/>
            <span className={styles.infoLabel}>虚拟仿真教学平台</span>
          </div>
          <div className={styles.infoLabel}>主办单位：河南农业大学烟草学院</div>
          <div className={styles.infoLabel}>Copvright © 2020-2023</div>
          <div className={styles.infoLabel}>联系我们：<a href="mailto:jiawei@henau.edu.cn" className={styles.infoLabel}>jiawei@henau.edu.cn</a></div>
        </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default HomePage;
