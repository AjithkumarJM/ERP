import API_CALL from "../index";
import { leaveTypesActionType, leaveBalanceType, holidayListType, upcomingHolidayListType } from './actionTypes';

const getLeaveTypes = () => API_CALL('get', 'typesofleaves/list', null, leaveTypesActionType);

const getLeaveBalance = id => API_CALL('get', `balanceleave/${id}`, null, leaveBalanceType);

const getHolidayList = () => API_CALL('get', 'holiday/list', null, holidayListType);

const getUpcomingHolidayList = () => API_CALL('get', 'sorted/holiday/list', null, upcomingHolidayListType);

const postApplyLeave = values => API_CALL('post', 'applyleave', values, 'POST_APPLY_LEAVE');

export { getLeaveTypes, getLeaveBalance, getHolidayList, postApplyLeave, getUpcomingHolidayList }