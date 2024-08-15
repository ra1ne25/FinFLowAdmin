import React from 'react';
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from 'cdbreact';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}> {/* Устанавливаем минимальную высоту */}
      <CDBSidebar textColor="#fff" backgroundColor="#171717" style={{ height: '100%', overflowY: 'auto' }}>
        <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
          <a href="/" className="text-decoration-none" style={{ color: 'inherit' }}>
            FinFlow Админ
          </a>
        </CDBSidebarHeader>

        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            <NavLink exact to="/" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="columns">Добавить историю</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/manage-stores" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="table">Управление магазинами</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/view-stories" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="list">Список историй</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/expiration-dates" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="clock">Срок действия</CDBSidebarMenuItem>
            </NavLink>
          </CDBSidebarMenu>
        </CDBSidebarContent>

        {/* <CDBSidebarFooter style={{ textAlign: 'center' }}>
          <div
            style={{
              padding: '20px 5px',
            }}
          >
            Sidebar Footer
          </div>
        </CDBSidebarFooter> */}
      </CDBSidebar>
    </div>
  );
};

export default Sidebar;
