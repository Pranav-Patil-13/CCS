const Input = ({ label, error, className = '', id, ...props }) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="form-group">
      {label && <label htmlFor={inputId}>{label}</label>}
      <input id={inputId} className={`form-input ${className}`} {...props} />
      {error && <p className="field-error">{error}</p>}
    </div>
  );
};

const Select = ({ label, options, className = '', id, ...props }) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="form-group">
      {label && <label htmlFor={inputId}>{label}</label>}
      <select id={inputId} className={`form-select ${className}`} {...props}>
        {options.map((opt) => (
          <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
            {typeof opt === 'string' ? opt : opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const Textarea = ({ label, className = '', id, ...props }) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="form-group">
      {label && <label htmlFor={inputId}>{label}</label>}
      <textarea id={inputId} className={`form-input ${className}`} {...props} />
    </div>
  );
};

Input.Select = Select;
Input.Textarea = Textarea;

export default Input;
