class ProjectQueryBuilderDTO {
    constructor(data = {}) {
        this.fields = this.mapFields(data.fields);
        this.logicOperators = this.mapLogicOperators(
            data.logic_operators
        );
    }

    mapFields(fields = []) {
        if (!Array.isArray(fields)) {
            return [];
        }

        return fields.map((field) => ({
            key: field?.key ?? "",
            label: field?.label ?? "",
            type: field?.type ?? "text",
            options: this.mapOptions(field?.source?.options),
            operators: this.mapOperators(field?.operators),
        }));
    }

    mapOptions(options = []) {
        return Array.isArray(options) ? options : [];
    }

    mapOperators(operators = []) {
        if (!Array.isArray(operators)) {
            return [];
        }

        return operators.map((operator) => ({
            value: operator?.value ?? "",
            label: operator?.label ?? "",
            input: this.getOperatorInput(operator?.value),
        }));
    }

    getOperatorInput(operator) {
        const inputMap = {
            in: "multi-select",
            not_in: "multi-select",
            between: "range",
        };

        return inputMap[operator] ?? "single";
    }

    mapLogicOperators(operators = []) {
        return Array.isArray(operators) ? operators : [];
    }

    toObject() {
    return {
        fields: this.fields,
        logicOperators: this.logicOperators,
    };
}
}

export default ProjectQueryBuilderDTO;