declare module '@prisma/adapter-pg' {
  import { Pool } from 'pg';
  export class PrismaPg {
    constructor(pool: Pool | object);
  }
}
