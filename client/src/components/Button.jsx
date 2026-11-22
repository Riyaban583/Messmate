const variants = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  danger: "btn-danger",
};

export default function Button({ variant = "primary", className = "", ...props }) {
  return <button className={`${variants[variant]} ${className}`} {...props} />;
}
