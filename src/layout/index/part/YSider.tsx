import React, { useEffect, useState } from 'react';
import { Menu, Layout } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import routes from '../../../router/index';

const {Sider} = Layout;
const {SubMenu} = Menu;

export default function YSider() {
  const location = useLocation();
  const [menu, setMenu] = useState<{openKeys: any[], selectedKeys: any[]}>({
    openKeys: [],
    selectedKeys: []
  });

  useEffect(() => {
    const pathname = location.pathname.split('/');
    if (menu.selectedKeys[0] !== `${pathname[1]}-${pathname[2]}`) {
      setMenu({
        ...menu,
        openKeys: Array.from(new Set([pathname[1],...menu.openKeys])),
        selectedKeys: [`${pathname[1]}-${pathname[2]}`]
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

  const  menuChange = (openKeys: any) => {
    const latestOpenKey = openKeys.find((key: any) => !menu.openKeys.includes(key));
    setMenu({...menu, openKeys: [latestOpenKey]})
  }

  const selectChange = (select:any) => {
    setMenu({...menu, selectedKeys: [select.key]})
  }

  return <Sider width={200} style={{borderRight: '1px solid #f0f0f0'}}>
    <Menu
      mode='inline'
      openKeys={menu.openKeys}
      selectedKeys={menu.selectedKeys}
      onOpenChange={menuChange}
      onSelect={selectChange}
      style={{height: '100%', borderRight: 0}}
    >
      {
        Object.keys(routes).map((item) => (
          <SubMenu
            key={item}
            title={<span>{React.createElement(routes[item].icon)}{routes[item].title}</span>}>
            {
              Object.keys(routes[item].children).map(child=>
                !routes[item].children[child].hidden  && <Menu.Item key={`${item}-${child}`}>
                  <Link to={`/${item}/${child}`}>{routes[item].children[child].title}</Link>
                </Menu.Item>
              )
            }
          </SubMenu>
        ))
      }
    </Menu>
  </Sider>
}
