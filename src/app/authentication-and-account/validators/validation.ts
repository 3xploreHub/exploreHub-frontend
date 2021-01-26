import { AbstractControl, ValidatorFn } from "@angular/forms";
export class CValidator {
  static validate(validations: any[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any[] } | null => {
      var errors = [];
      validations.forEach((val) => {
        switch (val.v) {
          case "required":
            errors.push(this.required(control));
            break;
          case "minLength":
            errors.push(this.minLength(control, val.r));
            break;
          case "maxLength":
            errors.push(this.maxLength(control, val.r));
            break;
          case "pattern":
            errors.push(this.pattern(control, val.r, val.m));
            break;
          case "invalidPattern":
            errors.push(this.invalidPattern(control, val.r));
            break;
          default:
            break;
        }
      });
      errors = errors.filter((er) => {
        return er !== null;
      });
      return errors.length > 0 ? { validations: errors } : null;
    };
  }

  static required(control: AbstractControl) {
    return control.value === undefined || control.value.length == 0
      ? { type: "required", message: "This field required" }
      : null;
  }

  static minLength(control: AbstractControl, min: number) {
    return control.value !== undefined &&
      control.value.length !== 0 &&
      control.value.length < min
      ? {
          type: "minLength",
          message: `Must be at least ${min} characters long.`,
        }
      : null;
  }

  static maxLength(control: AbstractControl, max: number) {
    return control.value !== undefined &&
      control.value.length !== 0 &&
      control.value.length > max
      ? {
          type: "maxLength",
          message: `Must not be more than ${max} characters long.`,
        }
      : null;
  }

  static invalidPattern(control: AbstractControl, pattern: string) {
    const pt = new RegExp(pattern);
    if (
      control.value !== undefined &&
      control.value.length !== 0 &&
      pt.test(control.value)
    ) {
      return { type: "invalid", message: "This input format is not allowed" };
    }
    return null;
  }

  static pattern(control: AbstractControl, pattern: string, must: string[]) {
    const pt = new RegExp(pattern);
    if (
      control.value !== undefined &&
      control.value.length !== 0 &&
      !pt.test(control.value)
    ) {
      var str = "";
      var sng = must.length == 1 ? "only" : "";
      must.forEach((m) => {
        str += must.indexOf(m) == must.length - 2 ? m + " and " : m + " , ";
      });
      return {
        type: "pattern",
        message: `Must ${sng} contain ${str.substring(0, str.length - 3)}.`,
      };
    }
    return null;
  }
}
