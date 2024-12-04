import React from 'react';

const SharePatterns = () => {
  return (
    <div className="container mt-4">
      <h2 className="mb-4">Share Patterns</h2>
      
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {/* Pattern cards will go here */}
        <div className="col">
          <div className="card bg-dark text-light border-secondary">
            <div className="card-body">
              <h5 className="card-title">Pattern Name</h5>
              <p className="card-text">Created by: Username</p>
              <div className="d-flex justify-content-between align-items-center">
                <button className="btn btn-primary">
                  <i className="bi bi-download me-2"></i>
                  Download
                </button>
                <span>
                  <i className="bi bi-heart me-1"></i>
                  42
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharePatterns;
