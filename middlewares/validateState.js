// for validating if user didn't type in /auth/google

export function validateState(req, res, next) {
    const { state } = req.query;
    if (state !== 'signup' && state !== 'login') {
        //invalid
      return res.redirect('/');
    }
    next();
  }