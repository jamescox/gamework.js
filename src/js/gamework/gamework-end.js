(function () {
  gamework.validateid = gamework._.validateId;

  delete gamework._;

  Object.freeze(window.gamework            );
  Object.freeze(window.gamework.game       );
  Object.freeze(window.gamework.collections);
  Object.freeze(window.gamework.graphics   );
  Object.freeze(window.gamework.input      );
  Object.freeze(window.gamework.math       );
  Object.freeze(window.gamework.music      );
  Object.freeze(window.gamework.sound      );
  Object.freeze(window.gamework.string     );
  Object.freeze(window.gamework.types      );
}());
