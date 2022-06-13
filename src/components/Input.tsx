import { FormControl, FormControlProps, FormErrorMessage, FormLabel, FormLabelProps, Input, InputProps } from '@chakra-ui/react'
import React, { ChangeEvent } from 'react'

interface props {
    label?: string
    erroMessage?: string
    error: boolean
    type?: string
    inputProps?: InputProps
    formControlProps?: FormControlProps
    formLabelProps?: FormLabelProps
    value?: any
    defaultValue?: any
    onChange: (e: React.FormEvent<HTMLInputElement>) => {}
    disabled?: boolean
}
const InputCustom: React.FC<props> = ({ label, erroMessage, error, defaultValue, value, type, onChange, disabled, inputProps, formControlProps, formLabelProps }) => {
    return (
        <FormControl {...formControlProps} isInvalid={error}>
            <FormLabel {...formLabelProps}>{label}</FormLabel>
            <Input {...inputProps} type={type} value={value} defaultValue={defaultValue} onChange={(e: React.FormEvent<HTMLInputElement>) => onChange(e)}
                borderColor={"#BBB"} disabled={disabled} _disabled={{ borderColor: "#BBB", bg: "#dedede", color: "#000" }} />
            <FormErrorMessage>{erroMessage}</FormErrorMessage>
        </FormControl>
    )
}

export default InputCustom