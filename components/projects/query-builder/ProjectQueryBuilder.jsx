"use client";

import React, { useState } from "react";
import { Plus, Trash2, Filter, RefreshCw, Play } from "lucide-react";
import MultiSelectCheckbox from "@/components/MultiSelectCheckbox";
export default function ProjectQueryBuilder({
  structure,
  onApplyQuery,
  initialRules = [],
  initialLogic = "and",
}) {
  // Structure from DTO

  const fields = structure?.fields || [];
  const logicOperators = structure?.logicOperators || [];

  // Create Empty Rule

  const createEmptyRule = () => ({
    id: Date.now() + Math.random(),
    field: "",
    operator: "",
    value: "",
  });

  // State

  const [logic, setLogic] = useState(initialLogic);

  const [rules, setRules] = useState(
    initialRules.length > 0 ? initialRules : [createEmptyRule()],
  );

  // Helpers

  const getFieldDefinition = (fieldKey) => {
    return fields.find((field) => field.key === fieldKey);
  };

  // Add Rule

  const handleAddRule = () => {
    setRules((prev) => [...prev, createEmptyRule()]);
  };

  // Remove Rule

  const handleRemoveRule = (id) => {
    if (rules.length === 1) return;

    setRules((prev) => prev.filter((rule) => rule.id !== id));
  };

  // Rule Change

  const handleRuleChange = (id, key, value) => {
    setRules((prev) =>
      prev.map((rule) => {
        if (rule.id !== id) {
          return rule;
        }

        const updatedRule = {
          ...rule,
          [key]: value,
        };

        // When changing field

        if (key === "field") {
          const selectedField = getFieldDefinition(value);

          const firstOperatorDefinition = selectedField?.operators?.[0];

          const firstOperator = firstOperatorDefinition?.value || "";

          const firstOperatorInput = firstOperatorDefinition?.input || "single";

          let defaultValue = "";

          if (firstOperatorInput === "multi-select") {
            defaultValue = [];
          }

          if (firstOperatorInput === "range") {
            defaultValue = ["", ""];
          }

          updatedRule.operator = firstOperator;

          updatedRule.value = defaultValue;
        }

        // When changing operator

        if (key === "operator") {
          const selectedField = getFieldDefinition(rule.field);

          const selectedOperator = selectedField?.operators?.find(
            (operator) => operator.value === value,
          );

          const operatorInput = selectedOperator?.input || "single";

          if (operatorInput === "multi-select") {
            updatedRule.value = [];
          } else if (operatorInput === "range") {
            updatedRule.value = ["", ""];
          } else {
            updatedRule.value = "";
          }

          // Keep field unchanged
          updatedRule.field = selectedField?.key || rule.field;
        }

        return updatedRule;
      }),
    );
  };

  // Reset

  const handleReset = () => {
    const defaultRules = [createEmptyRule()];

    setRules(defaultRules);
    setLogic("and");

    if (onApplyQuery) {
      onApplyQuery(defaultRules, "and");
    }
  };

  // Submit

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!onApplyQuery) return;

    onApplyQuery(rules, logic);
  };

  // Render Value Input

  const renderValueInput = (rule, field) => {
    // No field selected
    if (!field) {
      return (
        <input
          type="text"
          disabled
          placeholder="Select a field first..."
          className="w-full px-3 py-2 text-sm bg-zinc-100 border border-zinc-300 rounded-lg text-zinc-400"
        />
      );
    }

    // Get operator definition

    const operatorDefinition = field.operators?.find(
      (operator) => operator.value === rule.operator,
    );

    const operatorInput = operatorDefinition?.input || "single";

    const fieldType = field.type;

    const options = field.options || [];

    // RANGE

    if (operatorInput === "range") {
      return (
        <div className="flex gap-2 w-full">
          {/* From */}

          <input
            type={
              fieldType === "number"
                ? "number"
                : fieldType === "date"
                  ? "date"
                  : "text"
            }
            placeholder="From"
            value={Array.isArray(rule.value) ? rule.value[0] || "" : ""}
            onChange={(event) => {
              const newValue = [
                event.target.value,
                Array.isArray(rule.value) ? rule.value[1] || "" : "",
              ];

              handleRuleChange(rule.id, "value", newValue);
            }}
            className="w-full px-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg"
          />

          {/* To */}

          <input
            type={
              fieldType === "number"
                ? "number"
                : fieldType === "date"
                  ? "date"
                  : "text"
            }
            placeholder="To"
            value={Array.isArray(rule.value) ? rule.value[1] || "" : ""}
            onChange={(event) => {
              const newValue = [
                Array.isArray(rule.value) ? rule.value[0] || "" : "",
                event.target.value,
              ];

              handleRuleChange(rule.id, "value", newValue);
            }}
            className="w-full px-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg"
          />
        </div>
      );
    }

    // SELECT

    if (fieldType === "select") {
      // MULTI SELECT

      if (operatorInput === "multi-select") {
        const selectedValues = Array.isArray(rule.value) ? rule.value : [];

        return (
          <MultiSelectCheckbox
            options={options}
            value={rule.value}
            onChange={(values) => handleRuleChange(rule.id, "value", values)}
          />
        );
      }

      // NORMAL SELECT

      return (
        <select
          value={rule.value || ""}
          onChange={(event) =>
            handleRuleChange(rule.id, "value", event.target.value)
          }
          className="w-full px-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg"
        >
          <option value="">Select Value</option>

          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    // NUMBER

    if (fieldType === "number") {
      return (
        <input
          type="number"
          value={rule.value || ""}
          onChange={(event) =>
            handleRuleChange(rule.id, "value", event.target.value)
          }
          placeholder="Enter number..."
          className="w-full px-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg"
        />
      );
    }

    // DATE

    if (fieldType === "date") {
      return (
        <input
          type="date"
          value={rule.value || ""}
          onChange={(event) =>
            handleRuleChange(rule.id, "value", event.target.value)
          }
          className="w-full px-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg"
        />
      );
    }

    // DEFAULT

    return (
      <input
        type="text"
        value={rule.value || ""}
        onChange={(event) =>
          handleRuleChange(rule.id, "value", event.target.value)
        }
        placeholder="Value..."
        className="w-full px-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg"
      />
    );
  };

  // UI

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-xs mb-6">
      {/* Header */}

      <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-600" />

          <h3 className="font-semibold text-zinc-900">
            Advanced Filters
          </h3>
        </div>

        {/* Logic */}

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-zinc-500">Logic:</span>

          <select
            value={logic}
            onChange={(event) => setLogic(event.target.value)}
            className="px-3 py-1.5 text-xs font-semibold bg-zinc-50 border border-zinc-300 rounded-lg"
          >
            {logicOperators.map((operator) => (
              <option key={operator.value} value={operator.value}>
                {operator.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/*Rules*/}

      <form onSubmit={handleSubmit} className="space-y-3">
        {rules.map((rule) => {
          const selectedFieldDef = getFieldDefinition(rule.field);

          const fieldOperators = selectedFieldDef?.operators || [];

          return (
            <div
              key={rule.id}
              className="flex flex-wrap items-center gap-3 bg-zinc-50/70 p-3 rounded-lg border border-zinc-200/80"
            >
              {/* Field */}

              <select
                value={rule.field}
                onChange={(event) =>
                  handleRuleChange(rule.id, "field", event.target.value)
                }
                className="flex-1 min-w-[180px] px-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg"
              >
                <option value="">Select Field</option>

                {fields.map((field) => (
                  <option key={field.key} value={field.key}>
                    {field.label}
                  </option>
                ))}
              </select>

              {/* Operator */}

              <select
                value={rule.operator}
                onChange={(event) =>
                  handleRuleChange(rule.id, "operator", event.target.value)
                }
                disabled={!rule.field}
                className="flex-1 min-w-[150px] px-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg disabled:bg-zinc-100 disabled:text-zinc-400"
              >
                <option value="">Operator</option>

                {fieldOperators.map((operator) => (
                  <option key={operator.value} value={operator.value}>
                    {operator.label}
                  </option>
                ))}
              </select>

              {/* Dynamic Value*/}

              <div className="flex-1 min-w-[220px]">
                {renderValueInput(rule, selectedFieldDef)}
              </div>

              {/* Delete */}

              <button
                type="button"
                onClick={() => handleRemoveRule(rule.id)}
                disabled={rules.length === 1}
                className="p-2 text-zinc-400 hover:text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-30"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}

        {/* Footer */}

        <div className="flex items-center justify-between pt-2">
          {/* Add Condition */}

          <button
            type="button"
            onClick={handleAddRule}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg"
          >
            <Plus className="w-4 h-4" />
            Add Condition
          </button>

          <div className="flex items-center gap-2">
            {/* Reset */}

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-100 rounded-lg"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset
            </button>

            {/* Run Query */}

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              <Play className="w-4 h-4 fill-current" />
              Run Query
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
