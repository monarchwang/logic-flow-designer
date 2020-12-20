import { ShakeOutlined } from '@ant-design/icons';
import DeviceList from '../page/system/list/Index';
import DeviceTag from '../page/system/tag/Index';
import StarSet from '../page/system/starSet/Index';

const routes:any = {
  system: {
    title: '系统管理',
    icon: ShakeOutlined,
    children: {
      list: {
        title: '设备列表',
        component: DeviceList
      },
      tag: {
        title: '标签管理',
        component: DeviceTag
      },
      starSet: {
        title: '主播配置',
        component: StarSet
      }
    }
  }
}

export default routes;