const orderedStatus = ["New", "Contacted", "Qualified", "Converted"];

export function getAllowedTransitions(currentStatus) {
  if (currentStatus === "Converted") return ["Converted"];
  if (currentStatus === "Unqualified") return ["Unqualified", "Contacted"];

  const idx = orderedStatus.indexOf(currentStatus);
  if (idx === -1) return ["New"];

  const next = orderedStatus[idx + 1];
  return next ? [currentStatus, next, "Unqualified"] : [currentStatus];
}

export function isValidTransition(fromStatus, toStatus) {
  return getAllowedTransitions(fromStatus).includes(toStatus);
}
