import { getCustomRepository } from "typeorm";
import { AnimalGender, AnimalKind } from "../../entities/Animal";
import { AddressesRepository } from "../../repositories/AddressesRepository";
import { AnimalsRepository } from "../../repositories/AnimalsRepository";
import { UsersRepository } from "../../repositories/UsersRepository";
interface IAnimalRequest {
  volunteer_id: string;
  address_id: string;
  name: string;
  description: string;
  kind?: string;
  gender?: string;
  birth_date: Date;
}

class CreateAnimalService {
  async execute({
    volunteer_id,
    address_id,
    name,
    description,
    kind,
    gender,
    birth_date,
  }: IAnimalRequest) {
    const animalsRepository = getCustomRepository(AnimalsRepository);
    const usersRepository = getCustomRepository(UsersRepository);
    const addressesRepository = getCustomRepository(AddressesRepository);

    const volunteer = await usersRepository.findOne(volunteer_id);

    if (!volunteer) {
      throw new Error("User does not exist!");
    }

    const addressExists = await addressesRepository.findOne(address_id);

    if (!addressExists) {
      throw new Error("Address Id does not exist!");
    }

    kind = kind.trim().toUpperCase();
    const enumKind = AnimalKind[kind];

    gender = gender.trim().toUpperCase();
    const enumGender = AnimalGender[gender];

    const birthDate = new Date(birth_date);
    const now = new Date(Date.now());

    if (birthDate.getTime() > now.getTime()) {
      throw new Error("Invalid Date");
    }

    const animal = animalsRepository.create({
      volunteer_id,
      address_id,
      name,
      description,
      kind: enumKind,
      gender: enumGender,
      birth_date: birthDate,
      available: true,
    });

    await animalsRepository.save(animal);
    return animal;
  }
}

export { CreateAnimalService };
