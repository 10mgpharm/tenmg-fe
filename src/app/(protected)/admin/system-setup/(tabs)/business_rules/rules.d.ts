export type CreditSetting = {
    baseScore: number;
    rules: BusinessRuleItem[]
}

export type BusinessRuleItem = {
  id?: number;
  name: string;
  active: boolean;
  condition: RuleCondition;
  categoryId: number;
  description: string;
  scoreWeight: number;
  compareValue: number;
  logicalOperator: RuleOperator;
}