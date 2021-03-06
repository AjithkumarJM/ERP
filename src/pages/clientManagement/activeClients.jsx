import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Col } from 'reactstrap';
import moment from 'moment';
import Loader from 'react-loader-advanced';
import _ from 'lodash';

import { getActiveClients } from '../../services/clientManagement';
import { userInfo, spinner, tableOptions } from '../../const'

class ActiveClients extends Component {
    constructor(props) {
        super(props);
        this.state = {
            empDetails: {},
            modal: false
        }
    }

    componentWillMount = () => {
        const { role_id } = userInfo;
        const { getActiveClients } = this.props;

        getActiveClients();
    }

    renderupdate = (row, { client_id }) => <Link to={`/client_management/update_client/${client_id}`} className="btn btn-ems-ternary btn-sm mr-1">Update</Link>

    toggle = () => this.setState({ modal: !this.state.modal });

    renderTable = () => {
        const { data } = this.props.activeClients.response;
        const { role_id } = userInfo;

        return (
            <BootstrapTable data={data} maxHeight='500' version='4' options={tableOptions} ignoreSinglePage pagination >
                <TableHeaderColumn isKey dataField='client_name' dataAlign="center" dataFormat={this.generateName} searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>CLIENT NAME</TableHeaderColumn>
                <TableHeaderColumn dataField='client_id' dataAlign="center" searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>CLIENT ID</TableHeaderColumn>
                <TableHeaderColumn dataField='client_type_name' dataAlign="center" dataSort>CLIENT TYPE</TableHeaderColumn>
                <TableHeaderColumn dataField='client_type_id' dataAlign="center" dataSort >CLIENT TYPE ID</TableHeaderColumn>
                <TableHeaderColumn dataField='' dataAlign="center" dataFormat={this.renderupdate} hidden={role_id == 3 ? false : true}>ACTION</TableHeaderColumn>
            </BootstrapTable>
        )
    }

    render() {
        const { activeClients: { requesting } } = this.props;

        if (requesting) return <Loader show={true} message={spinner} />
        else {
            return (
                <div>
                    <div className="p-1 pt-3">
                        {this.renderTable()}
                    </div>
                </div >
            )
        }
    }
}

function mapStateToProps({ activeClients }) {
    return { activeClients };
}

export default connect(mapStateToProps, { getActiveClients })(ActiveClients);