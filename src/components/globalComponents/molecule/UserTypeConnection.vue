<template>
  <div class="card p-0 overflow-hidden border-none shadow-none bg-transparent max-w-5xl mx-auto">
    <div class="flex flex-col md:flex-row min-h-[600px] w-full bg-surface-0/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-surface-200/20">

      <!-- Side Image -->
      <div class="hidden md:block md:w-1/2 relative overflow-hidden group">
        <img
          src="/uploads/login_picture.jpg"
          alt="Login illustration"
          class="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/60 via-[#1a1a1a]/20 to-transparent"></div>
        <div class="absolute bottom-12 left-12 right-12 text-white">
          <h3 class="text-3xl font-bold mb-3 tracking-tight">Vivez l'expérience Carcassonne</h3>
          <p class="text-white/80 leading-relaxed text-sm max-w-xs font-medium">
            Participez aux animations, réservez vos ateliers et profitez de moments inoubliables.
          </p>
        </div>
      </div>

      <!-- Form Side -->
      <div class="flex-1 flex flex-col justify-center p-8 sm:p-16 bg-transparent relative">
        <Transition name="slide-fade" mode="out-in">
          <div :key="isLogin" class="w-full">

            <div v-if="isLogin" class="animate-in fade-in slide-in-from-right-4 duration-500">
              <header class="mb-10">
                <span class="inline-block px-3 py-1 rounded-full bg-emerald-950/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-4 border border-emerald-800/50">
                  Connexion
                </span>
                <h2 class="text-4xl font-black text-white mb-2 tracking-tight">Bon retour !</h2>
                <p class="text-surface-400 text-sm">Entrez vos identifiants pour accéder à votre compte.</p>
              </header>

              <LoginForm @close-dialog="closeDialog" />

              <footer class="mt-12 text-center text-sm text-surface-400 font-medium">
                Pas encore de compte ?
                <button
                  @click="isLogin = false"
                  class="font-bold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer ml-1 transition-colors"
                >
                  Créer un compte
                </button>
              </footer>
            </div>

            <div v-else class="animate-in fade-in slide-in-from-right-4 duration-500">
              <header class="mb-10">
                <span class="inline-block px-3 py-1 rounded-full bg-purple-950/30 text-purple-400 text-[10px] font-bold uppercase tracking-wider mb-4 border border-purple-800/50">
                  Inscription
                </span>
                <h2 class="text-4xl font-black text-white mb-2 tracking-tight">Bienvenue</h2>
                <p class="text-surface-400 text-sm">Rejoignez-nous et participez à l'aventure Carcassonne.</p>
              </header>

              <SignInForm />

              <footer class="mt-12 text-center text-sm text-surface-400 font-medium">
                J'ai déjà un compte.
                <button
                  @click="isLogin = true"
                  class="font-bold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer ml-1 transition-colors"
                >
                  Se connecter
                </button>
              </footer>
            </div>

          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LoginForm from './LoginForm.vue'
import SignInForm from './SignInForm.vue'

const isLogin = ref(true)
const emit = defineEmits(['hide-dialog'])

function closeDialog() {
  emit('hide-dialog')
}
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.2, 0.1, 0.2, 1);
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

button {
  background: none;
  border: none;
  padding: 0;
  font-family: inherit;
}
</style>
