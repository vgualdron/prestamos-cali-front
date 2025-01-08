export default {
  PATH: '@module/expense',
  actions: {
    LIST_EXPENSES: '@actions/listExpenses',
    LIST_EXPENSES_BY_USER: '@actions/listExpensesByUser',
    LIST_EXPENSES_BY_ITEM: '@actions/listExpensesByItem',
    GET_EXPENSE: '@actions/getExpense',
    SAVE_EXPENSE: '@actions/saveExpense',
    UPDATE_EXPENSE: '@actions/updateExpense',
    DELETE_EXPENSE: '@actions/deleteExpense',
  },
  getters: {
  },
  mutations: {
    SET_EXPENSES: '@mutations/setExpenses',
    SET_EXPENSE: '@mutations/setExpense',
    SET_STATUS: '@mutations/setStatus',
    SET_RESPONSE_MESSAGES: '@mutations/setResponseMessages',
  },
};
