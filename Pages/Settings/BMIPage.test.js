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

    const bmiOutput = getByLabelText("bmi output");
    const categoryOutput = getByLabelText("category output");

    // Events
    fireEvent.changeText(heightInput, 1.75);
    fireEvent.changeText(weightInput, 70);
    fireEvent.press(getByText('Calculate BMI'));

    // Checks
    expect(bmiOutput.children).toStrictEqual(["Your BMI: ", "22.9"]);
    expect(categoryOutput.children).toStrictEqual(["Category: ", "Healthy"]);
})