use crate::domain::*;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum OrchestratorAction {
    WaitForScriptApproval,
    WaitForStoryboardApproval,
    GenerateClips,
    AssembleVariants,
    Deliver,
    Complete,
    Idle,
}

pub struct RunMachine;

impl RunMachine {
    pub fn next_action(run: &GenerationRun) -> OrchestratorAction {
        match run.status {
            RunStatus::Draft => OrchestratorAction::Idle,
            RunStatus::AwaitingScriptApproval => OrchestratorAction::WaitForScriptApproval,
            RunStatus::AwaitingStoryboardApproval => OrchestratorAction::WaitForStoryboardApproval,
            RunStatus::Running => match run.stage {
                WorkflowStage::ClipGeneration => OrchestratorAction::GenerateClips,
                WorkflowStage::EditPlanning | WorkflowStage::Assembly => {
                    OrchestratorAction::AssembleVariants
                }
                WorkflowStage::Delivery => OrchestratorAction::Deliver,
                _ => OrchestratorAction::Idle,
            },
            RunStatus::PartialSuccess | RunStatus::Completed => OrchestratorAction::Complete,
            RunStatus::Failed | RunStatus::Cancelled => OrchestratorAction::Idle,
        }
    }

    pub fn advance_stage(stage: &WorkflowStage) -> WorkflowStage {
        match stage {
            WorkflowStage::Ingest => WorkflowStage::Normalize,
            WorkflowStage::Normalize => WorkflowStage::WritersRoom,
            WorkflowStage::WritersRoom => WorkflowStage::Storyboard,
            WorkflowStage::Storyboard => WorkflowStage::ClipGeneration,
            WorkflowStage::ClipGeneration => WorkflowStage::ClipQc,
            WorkflowStage::ClipQc => WorkflowStage::EditPlanning,
            WorkflowStage::EditPlanning => WorkflowStage::Assembly,
            WorkflowStage::Assembly => WorkflowStage::Delivery,
            WorkflowStage::Delivery => WorkflowStage::Delivery,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OrchestratorTick {
    pub run_id: String,
    pub action: OrchestratorAction,
    pub stage: WorkflowStage,
    pub status: RunStatus,
}
