import { Migration } from '@mikro-orm/migrations';

export class Migration20200822053722 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "product" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" timestamptz(0) not null);');
  }

}
