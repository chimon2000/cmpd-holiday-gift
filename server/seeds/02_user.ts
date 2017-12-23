import { props, join, compose } from 'ramda';
import { Connection } from 'typeorm';
const faker = require('faker');

import auth from '../apps/lib/auth';

import { User } from '../entities'

const fullName = compose(join(' '), props(['firstName', 'lastName']));

const createUser = (props = {}) => ({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  affilationId: faker.random.number({ min: 1, max: 57 }),
  email: faker.internet.email(),
  password: auth.hashPassword('admin'),
  nominationLimit: 5,
  active: true,
  confirmationEmail: true,
  approved: true,
  role: 'nominator',
  ...props
});

export default async (connection: Connection) => {
    const repo = connection.getRepository(User)

    for (let i = 0; i < 5; i++) {
        const user = createUser();
    
        if (user) {
          console.log(`Seeding household ${fullName(user)}`);
        }
    
        await repo.create(user);
    
      }

      await repo.create({
        firstName: 'Developer',
        lastName: 'lastName',
        affilationId: 1,
        email: 'developer@codeforcharlotte.org',
        password: auth.hashPassword('admin'),
        nominationLimit: 1000000,
        active: true,
        approved: true,
        role: 'admin'
      });

      await repo.create({
        firstName: 'Nominator',
        lastName: 'Account',
        affilationId: 2,
        email: 'nominator@codeforcharlotte.org',
        password: auth.hashPassword('admin'),
        nominationLimit: 5,
        active: true,
        approved: true,
        role: 'nominator'
      });

      await repo.create({
        firstName: 'NotYetApproved',
        lastName: 'Account',
        affilationId: 1,
        email: 'notyetapproved@codeforcharlotte.org',
        password: auth.hashPassword('admin'),
        nominationLimit: 5,
        active: true,
        approved: false,
        role: 'nominator'
      });

      await repo.create({
        firstName: 'Unapproved',
        lastName: 'Account',
        affilationId: 1,
        email: 'unapproved@codeforcharlotte.org',
        password: auth.hashPassword('admin'),
        nominationLimit: 5,
        active: false,
        approved: false,
        role: 'nominator'
      });

      await repo.create({
        firstName: 'Deactivated',
        lastName: 'Account',
        affilationId: 1,
        email: 'deactivated@codeforcharlotte.org',
        password: auth.hashPassword('admin'),
        nominationLimit: 5,
        active: false,
        approved: true,
        role: 'nominator'
      });
}