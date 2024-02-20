export const getBMI = (height, weight) => {
    if (isNaN(height) || isNaN(weight)) return -1;
    return weight / (height * height)
}
export const getBMICategory = (bmi) => {
    if (isNaN(bmi)) return 'Unknown';

    if (bmi < 18.5) return 'Underweight'
    else if (bmi >= 18.5 && bmi <= 24.9) return 'Healthy'
    else if (bmi >= 25.0 && bmi <= 29.9) return 'Overweight'
    else return 'Obese';
}