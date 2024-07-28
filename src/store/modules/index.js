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
};
