const variants = {
  success: 'badge badge-success',
  warning: 'badge badge-warning',
  info: 'badge badge-info',
  muted: 'badge badge-muted',
  danger: 'badge badge-danger',
};

const Badge = ({ variant = 'muted', children, className = '', ...props }) => {
  const cls = [variants[variant] || variants.muted, className]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={cls} {...props}>
      {children}
    </span>
  );
};

export default Badge;
