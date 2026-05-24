import { cn } from '@/lib/utils';

const ProductPrice = ({
  value,
  className,
}: {
  value: number;
  className?: string;
}) => {
  // Ensure two decimal places
  const stringValue = value.toFixed(2);
  // Get the int/float
  const [intValue, floatValue] = stringValue.split('.');

  return (
    <p className={cn('text-2xl', className)}>
      <span className="text-xs align-super">₹</span>
      {intValue}
      <span className="text-xs align-super">.{floatValue}</span>
    </p>
  );
};

export default ProductPrice;

// this component will take in a `value` and an optional `className` as prop
// we want the className to be dynamic, it's always gonna have a class of `text-2xl` but if we pass in the className prop, then I wanna use that as well
// and to do that we need to import a special utility function called `cn` and that's in your '@/lib/utils'
// import { cn } from "@/lib/utils";
// this 'cn' function is used for dynamic classes
