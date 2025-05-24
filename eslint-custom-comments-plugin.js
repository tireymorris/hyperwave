const noCommentsRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow all comments',
      category: 'Stylistic Issues',
      recommended: false,
    },
    schema: [],
    messages: {
      unexpected: 'Comments are an anti-pattern. Code should be self-explanatory.',
    },
  },
  create(context) {
    return {
      Program(node) {
        const sourceCode = context.getSourceCode();
        const comments = sourceCode.getAllComments();
        
        for (const comment of comments) {
          context.report({
            node: comment,
            messageId: 'unexpected',
          });
        }
      },
    };
  },
};

export default {
  rules: {
    'no-comments': noCommentsRule
  }
}; 