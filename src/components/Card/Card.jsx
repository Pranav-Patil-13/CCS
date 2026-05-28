import './Card.css';

const Card = ({ children, className = '', variant = 'panel', ...props }) => {
  return (
    <div className={`card card-${variant} ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardHeader = ({ title, subtitle, action, className = '' }) => (
  <div className={`card-header ${className}`}>
    <div>
      {title && <h2 className="card-title">{title}</h2>}
      {subtitle && <p className="card-subtitle">{subtitle}</p>}
    </div>
    {action && <div className="card-action">{action}</div>}
  </div>
);

const CardBody = ({ children, className = '' }) => (
  <div className={`card-body ${className}`}>{children}</div>
);

Card.Header = CardHeader;
Card.Body = CardBody;

export default Card;
