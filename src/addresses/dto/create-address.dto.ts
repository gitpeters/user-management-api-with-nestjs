
import { IsNotEmpty } from "class-validator";

export class CreateAddressDto {
    @IsNotEmpty()
    street: string;
    @IsNotEmpty()
    city: string;
    @IsNotEmpty()
    state: string;
    zipCode: string;
    @IsNotEmpty()
    country: string;
    userId: number;
}
