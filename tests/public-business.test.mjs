import test from 'node:test';
import assert from 'node:assert/strict';
import { publicBusiness } from '../src/lib/public-business.ts';
test('公開事業者情報から管理用の秘密値と個人情報を除く', () => {
  const input = {id:'example',service_name:'店名',admin_token:'secret',owner_name:'非公開',extra_secret:'hidden'};
  const result = publicBusiness(input);
  assert.equal(result.service_name,'店名');
  assert.equal(Object.hasOwn(result,'admin_token'),false);
  assert.equal(Object.hasOwn(result,'owner_name'),false);
  assert.equal(Object.hasOwn(result,'extra_secret'),false);
  assert.equal(input.admin_token,'secret');
});
