import { v4 as uuid } from 'uuid';

export class Hero {
  public id: string;
  public name: string;
  public power: string;
  public description: string;

  private constructor({
    id,
    name,
    power,
    description,
  }: {
    id: string;
    name: string;
    power: string;
    description: string;
  }) {
    this.id = id;
    this.name = name;
    this.power = power;
    this.description = description;
  }

  static create({
    id,
    name,
    power,
    description,
  }: {
    id?: string;
    name: string;
    power: string;
    description: string;
  }): Hero {
    return new Hero({ id: id ?? uuid(), name, power, description });
  }
}
