import React from "react";
import BMIPage from "./BMIPage";
import { fireEvent, render } from '@testing-library/react-native';

/*
test('renders correctly', () => {
    const tree = render(<BMIPage/>).toJSON();
    expect(tree).toMatchSnapshot();
})*/

test('healthy BMI - weight: 70kg, height: 175cm, BMI: 22.9', () => {
    const testCases = ['t1'];
    const mockFn = jest.fn();

    // Get elements via labels
    const { getByLabelText, getByText } = render(<BMIPage/>);

    const heightInput = getByLabelText("height input");
    const weightInput = getByLabelText("weight input");

    const bmiInfoOutput = getByLabelText("bmi info");

    // Events
    fireEvent.changeText(heightInput, 1.75);
    fireEvent.changeText(weightInput, 70);
    fireEvent.press(getByText('Calculate BMI'));

    // Checks
    expect(bmiInfoOutput.children[0].props).toStrictEqual({"bmi": "22.9", "category": "Healthy"});
})

test('underweight BMI - weight: 55kg, height: 175cm, BMI: 18.0', () => {
    const testCases = ['t1'];
    const mockFn = jest.fn();

    // Get elements via labels
    const { getByLabelText, getByText } = render(<BMIPage/>);

    const heightInput = getByLabelText("height input");
    const weightInput = getByLabelText("weight input");

    const bmiInfoOutput = getByLabelText("bmi info");

    // Events
    fireEvent.changeText(heightInput, 1.75);
    fireEvent.changeText(weightInput, 55);
    fireEvent.press(getByText('Calculate BMI'));

    // Checks
    expect(bmiInfoOutput.children[0].props).toStrictEqual({"bmi": "18.0", "category": "Underweight"});
})

test('overweight BMI - weight: 85kg, height: 175cm, BMI: 27.8', () => {
    const testCases = ['t1'];
    const mockFn = jest.fn();

    // Get elements via labels
    const { getByLabelText, getByText } = render(<BMIPage/>);

    const heightInput = getByLabelText("height input");
    const weightInput = getByLabelText("weight input");

    const bmiInfoOutput = getByLabelText("bmi info");

    // Events
    fireEvent.changeText(heightInput, 1.75);
    fireEvent.changeText(weightInput, 85);
    fireEvent.press(getByText('Calculate BMI'));

    // Checks
    expect(bmiInfoOutput.children[0].props).toStrictEqual({"bmi": "27.8", "category": "Overweight"});
})

test('obese BMI - weight: 100kg, height: 175cm, BMI: 32.6', () => {
    const testCases = ['t1'];
    const mockFn = jest.fn();

    // Get elements via labels
    const { getByLabelText, getByText} = render(<BMIPage/>);

    const heightInput = getByLabelText("height input");
    const weightInput = getByLabelText("weight input");

    const bmiInfoOutput = getByLabelText("bmi info");

    // Events
    fireEvent.changeText(heightInput, 1.75);
    fireEvent.changeText(weightInput, 100);
    fireEvent.press(getByText('Calculate BMI'));

    // Checks
    expect(bmiInfoOutput.children[0].props).toStrictEqual({"bmi": "32.7", "category": "Obese"});

})



test('display error for incorrect weight - weight: abc, height: 170cm', () => {
    const testCases = ['t1'];
    const mockFn = jest.fn();

    // Get elements via labels
    const { getByLabelText, getByText} = render(<BMIPage/>);

    const heightInput = getByLabelText("height input");
    const weightInput = getByLabelText("weight input");

    const bmiInfoOutput = getByLabelText("bmi info");

    // Events
    fireEvent.changeText(heightInput, 1.70);
    fireEvent.changeText(weightInput, "abc");
    fireEvent.press(getByText('Calculate BMI'));

    // Checks
    expect(bmiInfoOutput.children[0].props.children).toStrictEqual("ERROR: Invalid input! Please enter only numerical values in the fields.");
})

test('display error for incorrect height - weight: 59kg, height: def', () => {
    const testCases = ['t1'];
    const mockFn = jest.fn();

    // Get elements via labels
    const { getByLabelText, getByText} = render(<BMIPage/>);

    const heightInput = getByLabelText("height input");
    const weightInput = getByLabelText("weight input");

    const bmiInfoOutput = getByLabelText("bmi info");

    // Events
    fireEvent.changeText(heightInput, "def");
    fireEvent.changeText(weightInput, 59);
    fireEvent.press(getByText('Calculate BMI'));

    // Checks
    expect(bmiInfoOutput.children[0].props.children).toStrictEqual("ERROR: Invalid input! Please enter only numerical values in the fields.");
})

test('display error for incorrect fields - weight: abc, height: def', () => {
    const testCases = ['t1'];
    const mockFn = jest.fn();

    // Get elements via labels
    const { getByLabelText, getByText} = render(<BMIPage/>);

    const heightInput = getByLabelText("height input");
    const weightInput = getByLabelText("weight input");

    const bmiInfoOutput = getByLabelText("bmi info");

    // Events
    fireEvent.changeText(heightInput, "def");
    fireEvent.changeText(weightInput, "abc");
    fireEvent.press(getByText('Calculate BMI'));

    // Checks
    expect(bmiInfoOutput.children[0].props.children).toStrictEqual("ERROR: Invalid input! Please enter only numerical values in the fields.");
})