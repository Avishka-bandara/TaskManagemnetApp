// src/components/EditOffCanvas.jsx
import React from 'react';

const EditOffCanvas = ({
  show,
  title = 'Edit',
  data,
  setData,
  onClose,
  onSubmit,
  fields,
  dropdowns = [],
}) => {
  return (
    <div
      className={`offcanvas offcanvas-end ${show ? 'show d-block' : ''}`}
      tabIndex="-1"
      style={{
        visibility: show ? 'visible' : 'hidden',
        backgroundColor: 'white',
        width: '400px',
        zIndex: 1050,
      }}
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title">{title}</h5>
        <button type="button" className="btn-close text-reset" onClick={onClose}></button>
      </div>
      <div className="offcanvas-body">
        {data && (
          <form onSubmit={onSubmit}>
            {fields.map((field, index) => (
              <div className="mb-3" key={index}>
                <label>{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea
                    name={field.name}
                    className="form-control"
                    value={data[field.name] || ''}
                    onChange={(e) =>
                      setData({ ...data, [field.name]: e.target.value })
                    }
                  />
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    className="form-control"
                    value={data[field.name] || ''}
                    onChange={(e) =>
                      setData({ ...data, [field.name]: e.target.value })
                    }
                  />
                )}
              </div>
            ))}

            {dropdowns.map((dropdown, index) => (
              <div className="mb-3" key={`dropdown-${index}`}>
                <label>{dropdown.label}</label>
                <select
                  name={dropdown.name}
                  className="form-select"
                  value={data[dropdown.name] || ''}
                  onChange={(e) =>
                    setData({ ...data, [dropdown.name]: e.target.value })
                  }
                >
                  <option value="">{dropdown.placeholder}</option>
                  {dropdown.options.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {dropdown.display(opt)}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            <button type="submit" className="btn btn-primary w-100">Update</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditOffCanvas;
