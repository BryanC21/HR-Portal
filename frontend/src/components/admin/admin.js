import React, { Component } from 'react';
import { Container } from "react-bootstrap";
import AdminNav from '../nav/admin_nav';
import AdminMain from '../admin/admin_main';

class Admin extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>

                <AdminNav />
                <br />
                <Container>
                    <AdminMain />
                </Container>
                <br />
            </>
        );
    }
}

export default Admin;
