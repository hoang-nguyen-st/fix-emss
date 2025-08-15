import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'IsAdult', async: false })
export class IsAdultConstraint implements ValidatorConstraintInterface {
  validate(dateOfBirth: Date | string) {
    const dob = new Date(dateOfBirth);
    const now = new Date();
    if (dob > now) return false;
    const age = now.getFullYear() - dob.getFullYear();
    const m = now.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) {
      return age - 1 >= 18;
    }
    return age >= 18;
  }
  defaultMessage() {
    return 'Ngày sinh không hợp lệ: phải đủ 18 tuổi và không vượt quá ngày hiện tại';
  }
}
