use thiserror::Error;

pub type ServiceResult<T> = Result<T, ServiceError>;

#[derive(Debug, Error, Clone, PartialEq, Eq)]
pub enum ServiceError {
    #[error("not found: {0}")]
    NotFound(String),
    #[error("invalid request: {0}")]
    InvalidRequest(String),
    #[error("conflict: {0}")]
    Conflict(String),
    #[error("internal error: {0}")]
    Internal(String),
}
