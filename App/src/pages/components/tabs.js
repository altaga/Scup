import React, { useState } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';

const TabsNav = (props) => {
    const [activeTab, setActiveTab] = useState('1');

    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    }

    return (
        <div>
            <Nav tabs>
                <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === '1' })}
                        onClick={() => { toggle('1'); }}
                    >
                        Report
          </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === '2' })}
                        onClick={() => { toggle('2'); }}
                    >
                        ECG Details
          </NavLink>
                </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
                    { props.tab1 }
                </TabPane>
                <TabPane tabId="2">
                    { props.tab2 }
                </TabPane>
            </TabContent>
        </div>
    );
}

export default TabsNav;