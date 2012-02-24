(function () {
  delete micro._;

  Object.freeze(window.micro            );
  Object.freeze(window.micro.app        );
  Object.freeze(window.micro.collections);
  Object.freeze(window.micro.graphics   );
  Object.freeze(window.micro.input      );
  Object.freeze(window.micro.math       );
  Object.freeze(window.micro.music      );
  Object.freeze(window.micro.sound      );
  Object.freeze(window.micro.string     );
  Object.freeze(window.micro.types      );
}());
