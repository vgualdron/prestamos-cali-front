import common, { name as commonName } from './common';
import zone, { name as zoneName } from './zone';
import role, { name as roleName } from './role';
import permission, { name as permissionName } from './permission';
import yard, { name as yardName } from './yard';
import user, { name as userName } from './user';
import home, { name as homeName } from './home';
import news, { name as newName } from './new';
import diaries, { name as diarieName } from './diary';
import file, { name as fileName } from './file';
import zip, { name as zipName } from './zip';
import configuration, { name as configurationName } from './configuration';
import notification, { name as notificationName } from './notification';
import listing, { name as listingName } from './listing';
import lending, { name as lendingName } from './lending';
import payment, { name as paymentName } from './payment';
import district, { name as districtName } from './district';
import report, { name as reportName } from './report';
import expense, { name as expenseName } from './expense';
import area, { name as areaName } from './area';
import item, { name as itemName } from './item';
import question, { name as questionName } from './question';
import nequi, { name as nequiName } from './nequi';
import redcollector, { name as redcollectorName } from './redcollector';
import reddirection, { name as reddirectionName } from './reddirection';
import discount, { name as discountName } from './discount';
import workplan, { name as workplanName } from './workplan';
import task, { name as taskName } from './task';
import loan, { name as loanName } from './loan';
import deposit, { name as depositName } from './deposit';

export default {
  [homeName]: home,
  [commonName]: common,
  [zoneName]: zone,
  [roleName]: role,
  [permissionName]: permission,
  [yardName]: yard,
  [userName]: user,
  [newName]: news,
  [diarieName]: diaries,
  [fileName]: file,
  [zipName]: zip,
  [configurationName]: configuration,
  [notificationName]: notification,
  [listingName]: listing,
  [lendingName]: lending,
  [paymentName]: payment,
  [districtName]: district,
  [reportName]: report,
  [expenseName]: expense,
  [areaName]: area,
  [itemName]: item,
  [questionName]: question,
  [nequiName]: nequi,
  [redcollectorName]: redcollector,
  [reddirectionName]: reddirection,
  [discountName]: discount,
  [workplanName]: workplan,
  [taskName]: task,
  [loanName]: loan,
  [depositName]: deposit,
};
