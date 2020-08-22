import { Migration } from '@mikro-orm/migrations';

export class Migration20200822065155 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "product" drop constraint if exists "product_title_check";');
    this.addSql('alter table "product" alter column "title" type text using ("title"::text);');
  }

}
