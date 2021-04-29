import React from 'react';
import { Menu } from 'antd';


function LeftMenu(props) {
  return (
    <Menu mode={props.mode}>
      <Menu.Item key="favorite">
        <a style={{textDecoration: 'none'}} href="/favorite">Favorites</a>
      </Menu.Item>
    </Menu>
  )
}

export default LeftMenu