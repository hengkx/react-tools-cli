module.exports = {
    "parser": "babel-eslint",
    "extends": "airbnb",
    "env": {
        "browser": true,
        "node": true
    },
    "rules": {
        "arrow-parens": ["off"],
        "compat/compat": "error",
        "consistent-return": "off",
        "comma-dangle": "off",
        "generator-star-spacing": "off",
        "import/no-unresolved": "error",
        "import/no-extraneous-dependencies": "off",
        "no-console": "off",
        "no-use-before-define": "off",
        "no-multi-assign": "off",
        "promise/param-names": "error",
        "promise/always-return": "error",
        "promise/catch-or-return": "error",
        "promise/no-native": "off",
        "react/sort-comp": ["error", {
            "order": ["type-annotations", "static-methods", "lifecycle", "everything-else", "render"]
        }],
        "react/jsx-no-bind": "off",
        "react/forbid-prop-types": "off",
        "react/jsx-filename-extension": ["error", { "extensions": [".js", ".jsx"] }],
        "react/prefer-stateless-function": "off",
        "quotes": ["error", "single"],
        "linebreak-style": 0,
    },
    "plugins": [
        "import",
        "promise",
        "compat",
        "react"
    ]
}
