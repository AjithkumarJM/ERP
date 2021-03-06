import API_CALL from "../index";
import {
    allEmployeeInfoType, employeeByIdType, systemRoleType,
    reportingToListType, designationListType, prevEmpIdType, inActiveEmployeesType, allEmployeeInfoByIdType
} from "./actionTypes";

const getEmployeesInfo = () => API_CALL('get', `employee/list`, null, allEmployeeInfoType);

const getEmployeesInfoById = id => API_CALL('get', `employee/list/${id}`, null, allEmployeeInfoByIdType);

const getEmployeeById = id => API_CALL('get', `get/employee/${id}`, null, employeeByIdType);

const getSystemRole = () => API_CALL('get', 'rolelist/systemrole', null, systemRoleType)

const getReportingToList = () => API_CALL('get', 'employee/reportingto/list', null, reportingToListType);

const getDesignationList = () => API_CALL('get', 'employee/designation/list', null, designationListType);

const getPrevEmployeeId = () => API_CALL('get', 'get/last/employee/id', null, prevEmpIdType)

const createEmployee = (values, callback) => API_CALL('post', 'employee/create', values, null, callback);

const updateEmployee = (values, callback) => API_CALL('post', 'employee/update', values, null, callback);

const getInactiveEmployees = () => API_CALL('get', 'get/common/list/inactive/employee/details', null, inActiveEmployeesType)

export {
    getEmployeesInfo, getEmployeeById, getSystemRole, getReportingToList, getInactiveEmployees,
    getDesignationList, getPrevEmployeeId, createEmployee, updateEmployee, getEmployeesInfoById
}