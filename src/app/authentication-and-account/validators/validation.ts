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
          case "passwordPattern":
            errors.push(this.passwordPattern(control, val.r, val.m));
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
    
    return !control.value || control.value.length == 0
      ? { type: "required", message: "This field required" }
      : null;
  }

  static minLength(control: AbstractControl, min: number) {
    const msg = typeof control.value == 'number'? `Invalid number.`: `Must be at least ${min} characters.`;
    const value = control.value + ""
    return value &&
      value.length !== 0 &&
      value.length < min
      ? {
        type: "minLength",
        message: msg,
      }
      : null;
  }

  static maxLength(control: AbstractControl, max: number) {
    const msg = typeof control.value == 'number'? `Invalid number.`: `Must not be more than ${max} characters.`;
    const value = control.value + ""
    return value &&
      value.length !== 0 &&
      value.length > max
      ? {
        type: "maxLength",
        message: msg,
      }
      : null;
  }

  static invalidPattern(control: AbstractControl, pattern: string) {
    const pt = new RegExp(pattern);
    if (
      control.value &&
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
      control.value &&
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


  static passwordPattern(control: AbstractControl, pattern: string, must: string[]) {
    let requirements = ["lowercase", "uppercase", "numberOrSpecial"]
    const value = control.value.split("")
    if (value.length > 0) {
      requirements.forEach(requirement => {
        let none = true;
        value.forEach(char => {
          if (char.toUpperCase() != char.toLowerCase()  && char == char.toUpperCase() && requirement == "uppercase") {
            none = false
          }
          if (char.toUpperCase() != char.toLowerCase() && char == char.toLowerCase() && requirement == "lowercase") {
            none = false
          }  
          if (char.toLowerCase() == char.toUpperCase() && requirement == "numberOrSpecial") {
            none = false
          }
          
        });
        if (none) {
          requirements = requirements.filter(type => type != requirement)
        }
      })
    }
    if (
      control.value &&
      control.value.length !== 0 &&
      requirements.length != 3
    ) {
      let error = ""
      if (!requirements.includes("lowercase")) error += ` at least one lowercase|`
      if (!requirements.includes("uppercase")) error += ` at least one uppercase|`
      if (!requirements.includes("numberOrSpecial")) error += ` a number or a special character`
      return {
        type: "pattern",
        message: `Must have ${error.split("|")}`,
      };
    }
    return null;
  }
}
