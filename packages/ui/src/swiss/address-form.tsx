"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { Label } from "../components/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/select";
import { swissUI } from "../lib/utils";

export interface SwissAddressFormData {
  street: string;
  houseNumber: string;
  zipCode: string;
  city: string;
  canton: string;
}

interface SwissAddressFormProps {
  onSubmit: (data: SwissAddressFormData) => void;
  defaultValues?: Partial<SwissAddressFormData>;
  isLoading?: boolean;
}

export function SwissAddressForm({ 
  onSubmit, 
  defaultValues, 
  isLoading = false 
}: SwissAddressFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid }
  } = useForm<SwissAddressFormData>({
    defaultValues: {
      street: '',
      houseNumber: '',
      zipCode: '',
      city: '',
      canton: '',
      ...defaultValues
    },
    mode: 'onChange'
  });

  const watchedZipCode = watch('zipCode');

  // Auto-complete city based on postal code (simplified version)
  React.useEffect(() => {
    if (watchedZipCode && watchedZipCode.length === 4) {
      // In a real implementation, this would call the Swiss Post API
      // For now, we'll just show some common examples
      const cityMap: Record<string, string> = {
        '8001': 'Zürich',
        '3001': 'Bern',
        '4001': 'Basel',
        '1201': 'Genève',
        '1000': 'Lausanne',
        '6900': 'Lugano',
        '9000': 'St. Gallen',
      };
      
      const city = cityMap[watchedZipCode];
      if (city) {
        setValue('city', city);
      }
    }
  }, [watchedZipCode, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          <Label htmlFor="street">Strasse</Label>
          <Input
            id="street"
            {...register('street', { 
              required: 'Strasse ist erforderlich' 
            })}
            placeholder="Bahnhofstrasse"
            className={errors.street ? 'border-error' : ''}
          />
          {errors.street && (
            <p className="text-sm text-error mt-1">{errors.street.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="houseNumber">Nr.</Label>
          <Input
            id="houseNumber"
            {...register('houseNumber', { 
              required: 'Hausnummer ist erforderlich' 
            })}
            placeholder="123"
            className={errors.houseNumber ? 'border-error' : ''}
          />
          {errors.houseNumber && (
            <p className="text-sm text-error mt-1">{errors.houseNumber.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="zipCode">PLZ</Label>
          <Input
            id="zipCode"
            {...register('zipCode', { 
              required: 'PLZ ist erforderlich',
              pattern: {
                value: /^\d{4}$/,
                message: 'PLZ muss 4 Ziffern haben'
              }
            })}
            placeholder="8001"
            maxLength={4}
            className={errors.zipCode ? 'border-error' : ''}
          />
          {errors.zipCode && (
            <p className="text-sm text-error mt-1">{errors.zipCode.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="city">Ort</Label>
          <Input
            id="city"
            {...register('city', { 
              required: 'Ort ist erforderlich' 
            })}
            placeholder="Zürich"
            className={errors.city ? 'border-error' : ''}
          />
          {errors.city && (
            <p className="text-sm text-error mt-1">{errors.city.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="canton">Kanton</Label>
        <Select 
          onValueChange={(value) => setValue('canton', value, { shouldValidate: true })}
          defaultValue={defaultValues?.canton}
        >
          <SelectTrigger className={errors.canton ? 'border-error' : ''}>
            <SelectValue placeholder="Kanton auswählen" />
          </SelectTrigger>
          <SelectContent>
            {swissUI.getCantons().map((canton) => (
              <SelectItem key={canton.value} value={canton.value}>
                {canton.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.canton && (
          <p className="text-sm text-error mt-1">{errors.canton.message}</p>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        variant="swiss"
        disabled={!isValid || isLoading}
      >
        {isLoading ? 'Wird gespeichert...' : 'Adresse speichern'}
      </Button>
    </form>
  );
}