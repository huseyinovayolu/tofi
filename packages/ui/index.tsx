// Component exports
export { Button, type ButtonProps } from "./src/components/button";
export { Input, type InputProps } from "./src/components/input";
export { Label } from "./src/components/label";
export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./src/components/select";

// Swiss-specific components
export { SwissAddressForm, type SwissAddressFormData } from "./src/swiss/address-form";

// Utilities
export { cn, swissUI } from "./src/lib/utils";