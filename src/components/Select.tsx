import { FormControl, FormControlProps, FormErrorMessage, FormLabel, FormLabelProps, Select, SelectProps } from '@chakra-ui/react'
import React, { ReactNode } from 'react'

interface props {
    children?: ReactNode
    label?: string
    erroMessage?: string
    error: boolean
    type?: string
    selectProps?: SelectProps
    formControlProps?: FormControlProps
    formLabelProps?: FormLabelProps
    defaultValue?: any
    value?: any
    onChange: (e: React.FormEvent<HTMLSelectElement>) => {}
    disabled?: boolean
}
const SelectCustom: React.FC<props> = ({ children, label, erroMessage, error, defaultValue, value, type, onChange, disabled, selectProps, formControlProps, formLabelProps, }) => {
    return (
        <FormControl {...formControlProps} isInvalid={error}>
            <FormLabel {...formLabelProps}>{label}</FormLabel>
            <Select {...selectProps} type={type} value={value} defaultValue={defaultValue} borderColor={"#BBB"}
                onChange={(e: React.FormEvent<HTMLSelectElement>) => onChange(e)}
                disabled={disabled}
                _disabled={{ borderColor: "#BBB", bg: "#dedede", color: "#090505" }} >
                {children}
            </Select>
            <FormErrorMessage>{erroMessage}</FormErrorMessage>
        </FormControl>
    )
}

export default SelectCustom