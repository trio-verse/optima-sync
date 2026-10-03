export function serializeQueryPayload(rules, logic) {
  const formattedConditions = rules.map((rule) => {
    let value = rule.value;

    if ((rule.operator === "in" || rule.operator === "not_in") && !Array.isArray(value)) {
      value = value ? [value] : [];
    }

    return {
      field: rule.field,
      operator: rule.operator,
      value: value,
    };
  });

  return {
    query: {
      logic: logic,
      conditions: formattedConditions,
    },
  };
}

export function parseQueryParamsToRules(searchParams) {
  const rules = [];
  let index = 0;

  while (searchParams.has(`rules[${index}][field]`)) {
    const field = searchParams.get(`rules[${index}][field]`);
    const operator = searchParams.get(`rules[${index}][operator]`);
    const value = searchParams.get(`rules[${index}][value]`);

    if (field && operator) {
      rules.push({ id: Date.now() + index, field, operator, value });
    }
    index++;
  }

  const logic = searchParams.get("logic") || "and";

  return {
    logic,
    rules: rules.length > 0 ? rules : [{ id: Date.now(), field: "", operator: "", value: "" }],
  };
}

/**
 * تحديث URL Search Params بناءً على الشروط
 */
export function buildQuerySearchParams(rules, logic) {
  const params = new URLSearchParams();
  params.set("logic", logic);

  rules.forEach((rule, index) => {
    if (rule.field && rule.operator && rule.value !== undefined && rule.value !== "") {
      params.set(`rules[${index}][field]`, rule.field);
      params.set(`rules[${index}][operator]`, rule.operator);
      params.set(`rules[${index}][value]`, rule.value);
    }
  });

  return params;
}