import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Loader from 'react-loader-advanced';
import AlertContainer from 'react-alert'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import { spinner, alertOptions, userInfo, tableOptions } from '../../const';
import { getAssets, postAssetStatus } from '../../services/assetManagement';

class AssignedAssets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            outputValues: [],
            toggleButton: false,
            loader: false,
            modal: false
        }
    }

    componentWillMount() {
        const { getAssets } = this.props;
        getAssets('ASSIGNED');
    }

    handleOnRowSelect = ({ id }, isSelected) => {
        const { outputValues } = this.state;
        let index = outputValues.indexOf(id)

        if (isSelected === true) {
            outputValues.push(id)
            this.setState({ toggleButton: true })
        } else {
            outputValues.splice(index, 1)
            outputValues.length === 0 ? this.setState({ toggleButton: false }) : null
        }
    }

    handleOnSelectAll = (isSelected, row) => {
        const { outputValues } = this.state;

        if (isSelected === true) {
            _.map(row, ({ id }) => outputValues.push(id))
            this.setState({ toggleButton: true })
        } else {
            this.state.outputValues.splice(0, outputValues.length)
            outputValues.length === 0 ? this.setState({ toggleButton: false }) : null
        }
    }

    formatDate = date => typeof (date == 'string') ? moment(date).format('YYYY/MM/DD') : date

    renderupdate = (row, { id }) => <Link to={`/asset_management/update_asset/${id}`} className="btn btn-ems-ternary btn-sm mr-1">Update</Link>

    renderAssetLink = (row, { asset_serial_no, id }) => <Link to={`/asset_management/info/${id}`}>{asset_serial_no}</Link>

    renderAssetTable = () => {
        const { data } = this.props.assetsList.response;

        const selectRowOptions = {
            mode: "checkbox",
            clickToSelect: false,
            onSelect: this.handleOnRowSelect,
            onSelectAll: this.handleOnSelectAll
        };

        return (
            < BootstrapTable
                selectRow={selectRowOptions}
                data={data}
                version='4'
                options={tableOptions}
                ignoreSinglePage
                pagination
            >
                <TableHeaderColumn isKey dataField='id' hidden dataAlign="center"  >id</TableHeaderColumn>
                <TableHeaderColumn dataField='asset_serial_no' dataAlign="center" searchable={false} filter={{ type: 'TextFilter', delay: 1000 }} dataFormat={this.renderAssetLink}>SERIAL #</TableHeaderColumn>
                <TableHeaderColumn dataField='make' dataAlign="center" searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>MAKE</TableHeaderColumn>
                <TableHeaderColumn dataField='type_name' dataAlign="center" searchable={false} filter={{ type: 'TextFilter', delay: 1000 }}>TYPE</TableHeaderColumn>
                <TableHeaderColumn dataField='model' dataAlign="center" >Model</TableHeaderColumn>
                <TableHeaderColumn dataField='employee_name' dataAlign="center" filter={{ type: 'TextFilter', delay: 1000 }}>ASSIGNED TO</TableHeaderColumn>
                <TableHeaderColumn dataField='assigned_on' dataAlign="center" dataSort dataFormat={this.formatDate}>ASSIGNED ON</TableHeaderColumn>
                <TableHeaderColumn dataField='' dataAlign="center" dataFormat={this.renderupdate}>ACTION</TableHeaderColumn>
            </BootstrapTable>
        )
    }

    notify = (message, type) => this.msg.show(message, { type })

    toggle = () => this.setState({ modal: !this.state.modal })

    onSubmitAsset = type => {
        const { outputValues } = this.state;
        const { postAssetStatus, getAssets } = this.props;

        let values = {
            "asset_id_list": outputValues,
            "status_name": type
        }

        this.setState({ loader: true, modal: type === 'SCRAP' ? !this.state.modal : null })
        postAssetStatus(values, response => {
            const { code, message } = response.data;

            if (code === 'EMS_001') {
                this.setState({ loader: false })
                getAssets('ASSIGNED')
                setTimeout(() => this.notify(message, 'success'), 2000);
            } else {
                this.notify(message, 'error')
                this.setState({ loader: false })
            }
        })
    }

    renderActionButtons = () => {
        const { outputValues: { length }, toggleButton } = this.state;

        if (toggleButton && length !== 0) {

            return (
                <div className='actionBtnStyling'>
                    <button className='btn btn-secondary float-right btn-ems-ternary btn-sm' onClick={() => this.onSubmitAsset('AVAILABLE')}>Move To Available
                <i className='fa fa-tasks ml-2' /></button>

                    <button className='btn btn-secondary float-right btn-ems-ternary btn-sm mr-1' onClick={this.toggle}>Scrap Asset
                <i className='fa fa-trash ml-2' /></button>
                </div>
            );
        }
    }

    render() {
        const { assetsList: { requesting }, className } = this.props;
        const { loader, modal } = this.state;

        if (requesting) return <Loader show={true} message={spinner} />
        else {
            return (
                <div className='p-2 pt-3'>
                    <Loader show={loader} message={spinner} />
                    <AlertContainer ref={a => this.msg = a} {...alertOptions} />
                    {this.renderAssetTable()}
                    {this.renderActionButtons()}
                    <Modal isOpen={modal} toggle={this.toggle} className={className}>
                        <ModalBody>
                            <h4 className="text-center">Are you sure, you want to scrap the Asset(s) ?</h4>
                        </ModalBody>
                        <ModalFooter>
                            <button className='btn btn-sm btn-ems-primary' onClick={() => this.onSubmitAsset('SCRAP')}>Yes</button>
                            <button className='btn btn-sm btn-ems-clear' onClick={this.toggle}>No</button>
                        </ModalFooter>
                    </Modal>
                </div>
            );
        }
    }
}

const mapStateToProps = ({ assetsList }) => {
    return { assetsList }
}

export default connect(
    mapStateToProps, { getAssets, postAssetStatus }
)(AssignedAssets);